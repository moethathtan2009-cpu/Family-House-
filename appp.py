import asyncio
import uuid  
import threading
import time
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from telegram import Bot

app = Flask(__name__)
CORS(app)

BOT_TOKEN = "8929389162:AAFIz3X3E8R3mzDWj9VeWE5hItN5atTS6Hw"
CHAT_ID = "8512030164"

bot = Bot(token=BOT_TOKEN)

IS_MODIFYING = False
posts_storage = []

def delayed_telegram_delete(message_id):
    def run():
        time.sleep(30) 
        new_loop = asyncio.new_event_loop()
        try:
            new_loop.run_until_complete(bot.delete_message(chat_id=CHAT_ID, message_id=message_id))
            print(f"Telegram Message {message_id} deleted after 30 seconds.")
        except Exception as e:
            print(f"Error deleting telegram message: {e}")
        finally:
            new_loop.close()
            
    threading.Thread(target=run, daemon=True).start()

@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify({"is_modifying": IS_MODIFYING})

@app.route("/api/posts", methods=["GET"])
def get_posts():
    return jsonify(posts_storage)

@app.route("/api/posts", methods=["POST"])
def create_post():
    if IS_MODIFYING:
        return jsonify({"error": "Application is modifying..."}), 403
        
    data = request.json
    post_text = data.get("text")
    user_id = data.get("userId") 

    if not post_text:
        return jsonify({"error": "စာသား မပါဝင်ပါ"}), 400

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        tg_message = loop.run_until_complete(
            bot.send_message(chat_id=CHAT_ID, text=post_text)
        )
        message_id = tg_message.message_id
        post_id = str(uuid.uuid4())

        new_post = {
            "id": post_id, 
            "text": post_text, 
            "userId": user_id, 
            "view_users": [user_id] if user_id else [], 
            "comments": []
        }
        posts_storage.insert(0, new_post)
        delayed_telegram_delete(message_id)
        
        return jsonify({"success": True, "post": new_post})
    except Exception as e:
        print(f"Telegram Error: {e}")
        return jsonify({"error": "Error"}), 500

@app.route("/api/posts/<post_id>/view", methods=["POST"])
def view_post(post_id):
    data = request.json or {}
    user_id = data.get("userId") 

    if not user_id:
        return jsonify({"error": "User ID မပါဝင်ပါ"}), 400

    target_post = None
    for post in posts_storage:
        if post["id"] == post_id:
            target_post = post
            break

    if not target_post:
        return jsonify({"error": "Post ရှာမတွေ့ပါ"}), 404

    if "view_users" not in target_post:
        target_post["view_users"] = []
        
    if user_id not in target_post["view_users"]:
        target_post["view_users"].append(user_id)

    return jsonify({"success": True, "views_count": len(target_post["view_users"])})

@app.route("/api/posts/<post_id>", methods=["DELETE"])
def delete_post(post_id):
    data = request.json or {}
    request_user_id = data.get("userId") 

    target_post = None
    for post in posts_storage:
        if post["id"] == post_id:
            target_post = post
            break

    if not target_post:
        return jsonify({"error": "Post ရှာမတွေ့ပါ"}), 404

    if target_post.get("userId") == request_user_id:
        posts_storage.remove(target_post)
        return jsonify({"success": True})
    else:
        return jsonify({"error": "သင်တင်ခဲ့သော Post မဟုတ်သဖြင့် ဖျက်ပိုင်ခွင့်မရှိပါ"}), 403

@app.route("/api/posts/<post_id>/comments", methods=["POST"])
def add_comment(post_id):
    if IS_MODIFYING:
        return jsonify({"error": "Application is modifying..."}), 403

    data = request.json
    comment_text = data.get("text")

    if not comment_text:
        return jsonify({"error": "Comment စာသား မပါဝင်ပါ"}), 400

    target_post = None
    for post in posts_storage:
        if post["id"] == post_id:
            target_post = post
            break

    if not target_post:
        return jsonify({"error": "Post ရှာမတွေ့ပါ"}), 404

    target_post["comments"].append(comment_text)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        noti_text = f"💬 အားပေးစကားအသစ်တစ်ခု တက်လာပါပြီ!\n\nPost: '{target_post['text']}'\n\nComment: '{comment_text}'"
        loop.run_until_complete(bot.send_message(chat_id=CHAT_ID, text=noti_text))
    except Exception as e:
        print(f"Telegram Noti Error: {e}")

    return jsonify({"success": True, "post": target_post})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)
