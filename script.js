// ====== 🔑 USER UNIQUE ID GENERATOR ======
if (!localStorage.getItem('my_secret_user_id')) {
    const uniqueId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('my_secret_user_id', uniqueId);
}
const MY_USER_ID = localStorage.getItem('my_secret_user_id');


// ====== 🌐 LANGUAGE SETTING LOGIC (MM / EN) ======
let currentLang = localStorage.getItem('app_lang') || 'MM';

const translations = {
    MM: {
        langBtn: "🇲🇲 မြန်မာ",
        title: "မင်းရဲ့ ခံစားချက်တွေကို ရေးပါ",
        placeholder: "မိသားစုဝင်တွေဟာ တစ်ယောက်ကိုတစ်ယောက် ကူညီဖေးမဖို့ အမြဲအသင့်ရှိနေပါတယ်...",
        postBtn: "Post တင်မယ်",
        feedTitle: "နောက်ဆုံး တင်ထားသောစာများ",
        backBtn: "← နောက်သို့ ပြန်သွားရန်",
        commentTitle: "💬 အားပေးစကားများ",
        commentPlaceholder: "နွေးထွေးတဲ့ အားပေးစကားလေး ရေးပေးလိုက်ပါ...",
        commentSubmitBtn: "ပို့မည်",
        noPosts: "ရင်ဖွင့်ထားတဲ့စာ လောလောဆယ် မရှိသေးပါဘူးဗျာ။",
        commentCount: "💬 အားပေးစကား ({count}) ခု ရှိပါတယ်",
        noComments: "အားပေးစကား မရှိသေးပါ... ပထမဆုံး အားပေးသူ ဖြစ်လိုက်ပါ!",
        deleteBtn: "🗑️ ဖျက်မယ်",
        alertEmptyPost: "မွန်းကျပ်တာတွေ သက်သာအောင် စာသားတစ်ခုခု ရေးပါဦးဗျာ။",
        alertPostSuccess: "ရင်ဖွင့်ပြီးပါပြီ။ မိသားစုဝင်တွေထဲက တစ်ယောက်ယောက်က အားပေးစကား လာရေးပေးပါလိမ့်မယ်။",
        alertServerErr: "Python Server ချိတ်ဆက်မှု မရပါဗျာ။",
        alertConfirmDelete: "ဒီရင်ဖွင့်စာကို အပြီးဖျက်ပစ်ချင်တာ သေချာပါသလား?",
        alertDeleteSuccess: "ရင်ဖွင့်စာကို ဖျက်လိုက်ပါပြီဗျာ။",
        alertDeleteFail: "ဖျက်ခွင့်မရှိပါ သို့မဟုတ် Error ဖြစ်နေသည်။",
        alertEmptyComment: "အားပေးစကားလေး တစ်ခုခု အရင်ရေးပါဦး။",
        alertCommentFail: "ပို့လို့မရဖြစ်သွားပါတယ်ဗျာ।"
    },
    EN: {
        langBtn: "🇺🇸 EN",
        title: "Write your feeling",
        placeholder: "Family is always ready to support each other...",
        postBtn: "Submit Post",
        feedTitle: "Latest posted",
        backBtn: "← Back to Home",
        commentTitle: "💬 Supporter Comments",
        commentPlaceholder: "Write a warm message to support...",
        commentSubmitBtn: "Send",
        noPosts: "There are no posted feelings yet.",
        commentCount: "💬 ({count}) Comments of support",
        noComments: "No comments yet... Be the first to support!",
        deleteBtn: "🗑️ Delete",
        alertEmptyPost: "Please write something to ease your mind.",
        alertPostSuccess: "Post submitted! Family members will leave supportive words soon.",
        alertServerErr: "Cannot connect to Python Server.",
        alertConfirmDelete: "Are you sure you want to delete this post?",
        alertDeleteSuccess: "Post deleted successfully.",
        alertDeleteFail: "Unauthorized or Error occurred.",
        alertEmptyComment: "Please write a supportive comment first.",
        alertCommentFail: "Failed to send comment."
    }
};

function applyLanguage() {
    const t = translations[currentLang];
    
    document.getElementById('langBtn').innerText = t.langBtn;
    document.getElementById('title').innerText = t.title;
    document.getElementById('postText').placeholder = t.placeholder;
    document.getElementById('postBtn').innerText = t.postBtn;
    document.getElementById('feedTitle').innerText = t.feedTitle;
    document.getElementById('backBtn').innerText = t.backBtn;
    document.getElementById('commentTitle').innerText = t.commentTitle;
    document.getElementById('commentText').placeholder = t.commentPlaceholder;
    document.getElementById('commentSubmitBtn').innerText = t.commentSubmitBtn;
    
    loadPosts();
}

function toggleLanguage() {
    currentLang = (currentLang === 'MM') ? 'EN' : 'MM';
    localStorage.setItem('app_lang', currentLang);
    applyLanguage();
}


// ====== ⏳ INTRO SCREEN & PAGE SETUP ======
document.addEventListener("DOMContentLoaded", () => {
    const introPage = document.getElementById('intro-page');
    const mainPage = document.getElementById('mainPage');
    const rulesScreen = document.getElementById('rulescreen');

    introPage.style.display = 'flex';
    mainPage.style.display = 'none';
    rulesScreen.style.display = 'none';

    setTimeout(() => {
        introPage.style.display = 'none';
        mainPage.style.display = 'block';
        document.body.classList.remove("no-scroll");
    }, 3000);
});


// ====== 🎨 CUSTOM ALERT FUNCTION ======
function showCustomAlert(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('customAlert');
        const msgText = document.getElementById('alertMessage');
        const okBtn = document.getElementById('alertOkBtn');
        const cancelBtn = document.getElementById('alertCancelBtn');

        msgText.innerText = message;
        cancelBtn.style.display = "none"; 
        modal.style.display = "flex";

        okBtn.onclick = function() {
            modal.style.display = "none";
            resolve(true);
        };
    });
}

function showCustomConfirm(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('customAlert');
        const msgText = document.getElementById('alertMessage');
        const okBtn = document.getElementById('alertOkBtn');
        const cancelBtn = document.getElementById('alertCancelBtn');

        msgText.innerText = message;
        cancelBtn.style.display = "block"; 
        modal.style.display = "flex";

        okBtn.onclick = function() {
            modal.style.display = "none";
            resolve(true);
        };
        cancelBtn.onclick = function() {
            modal.style.display = "none";
            resolve(false);
        };
    });
}


// ====== 🌐 API SERVER CONFIGURATION ======
const BASE_URL = "https://family-house-ylaz.onrender.com"; 
const API_URL = `${BASE_URL}/api/posts`;
let allPosts = []; 
let currentPostId = null; 


// ====== ⚠️ 🛠️ APP STATUS CHECK LOGIC ======
async function checkAppStatus() {
    try {
        const response = await fetch(`${BASE_URL}/api/status`);
        const data = await response.json();
        
        let modBadge = document.getElementById("modifyingBadge");
        const postBtn = document.getElementById('postBtn');
        const textInput = document.getElementById('postText');

        if (data.is_modifying) {
            if (!modBadge) {
                modBadge = document.createElement("div");
                modBadge.id = "modifyingBadge";
                modBadge.innerHTML = "⚠️ Modifying...";
                document.body.insertBefore(modBadge, document.body.firstChild);
            }
            if (postBtn) postBtn.disabled = true;
            if (textInput) textInput.disabled = true;
        } else {
            if (modBadge) modBadge.remove();
            if (postBtn) postBtn.disabled = false;
            if (textInput) textInput.disabled = false;
        }
    } catch (error) {
        console.error("Error checking status:", error);
    }
}


// ====== 📝 POST FEED LOGIC ======
async function loadPosts() {
    try {
        const response = await fetch(API_URL);
        allPosts = await response.json();
        const feed = document.getElementById('postFeed');
        if (!feed) return;
        feed.innerHTML = ''; 

        if(allPosts.length === 0) {
            const t = translations[currentLang];
            feed.innerHTML = `<p style="color: #888; text-align: center;">${t.noPosts}</p>`;
            return;
        }

        allPosts.forEach(post => {
            const viewsCount = post.view_users ? post.view_users.length : 0;

            const card = document.createElement('div');
            card.className = 'post-card';
            card.onclick = () => openCommentPage(post.id);

            const pText = document.createElement('div');
            pText.className = 'post-text';
            pText.innerText = post.text;
            card.appendChild(pText);

            const footerContainer = document.createElement('div');
            footerContainer.style.display = "flex";
            footerContainer.style.justify = "space-between";
            footerContainer.style.alignItems = "center";
            footerContainer.style.marginTop = "10px";

            const vCountSpan = document.createElement('span');
            vCountSpan.style.fontSize = "13px";
            vCountSpan.style.color = "#888";
            vCountSpan.innerText = `👁️ ${viewsCount}`;
            footerContainer.appendChild(vCountSpan);

            const cCount = document.createElement('div');
            cCount.className = 'comment-count';
            cCount.style.fontSize = "13px";
            const count = post.comments ? post.comments.length : 0;
            cCount.innerText = `💬 (${count})`;
            footerContainer.appendChild(cCount);

            card.appendChild(footerContainer);

            if (post.userId === MY_USER_ID) {
                const t = translations[currentLang];
                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = t.deleteBtn;
                deleteBtn.style.background = "#e94560";
                deleteBtn.style.padding = "6px 12px";
                deleteBtn.style.fontSize = "12px";
                deleteBtn.style.marginTop = "10px";
                deleteBtn.style.float = "left";
                deleteBtn.style.borderRadius = "6px";
                
                deleteBtn.onclick = async (e) => {
                    e.stopPropagation(); 
                    
                    const tAlert = translations[currentLang];
                    const confirmDelete = await showCustomConfirm(tAlert.alertConfirmDelete);
                    if (confirmDelete) {
                        try {
                            const res = await fetch(`${API_URL}/${post.id}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: MY_USER_ID })
                            });
                            const delResult = await res.json();
                            if (delResult.success) {
                                await showCustomAlert(tAlert.alertDeleteSuccess);
                                loadPosts();
                            } else {
                                showCustomAlert(delResult.error || tAlert.alertDeleteFail);
                            }
                        } catch (err) {
                            showCustomAlert(tAlert.alertServerErr);
                        }
                    }
                };
                card.appendChild(deleteBtn);
            }

            const clearDiv = document.createElement('div');
            clearDiv.style.clear = 'both';
            card.appendChild(clearDiv);

            feed.appendChild(card);
            registerPostView(post.id);
        });
    } catch (error) {
        console.error("Error loading posts:", error);
    }
}

async function registerPostView(postId) {
    try {
        await fetch(`${API_URL}/${postId}/view`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: MY_USER_ID })
        });
    } catch (error) {
        console.error("Error registering view:", error);
    }
}

async function submitPost() {
    const textInput = document.getElementById('postText');
    const text = textInput.value.trim();
    const t = translations[currentLang];

    if (!text) {
        await showCustomAlert(t.alertEmptyPost);
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: text,
                userId: MY_USER_ID 
            })
        });

        const result = await response.json();

        if (result.success) {
            textInput.value = ''; 
            loadPosts(); 
            
            document.getElementById('createPostScreen').style.display = "none";
            document.getElementById('open-create-post-btn').style.display = "flex";
            document.getElementById('setting-btn').style.display = "flex";

            await showCustomAlert(t.alertPostSuccess);
        }
    } catch (error) {
        await showCustomAlert(t.alertServerErr);
    }
}


// ====== 🔑 RULE SCREEN LOGIC (OPEN / CLOSE) ======
const settingBtn = document.getElementById('setting-btn');
const backarrowBtn = document.getElementById('backarrow-btn');
const rulescreen = document.getElementById('rulescreen');
const mainPage = document.getElementById('mainPage');

settingBtn.addEventListener('click', () => {
    rulescreen.style.flexDirection = "column";
    rulescreen.style.display = "flex"; 
    mainPage.style.display = "none";
    settingBtn.style.display = "none"; 
    document.getElementById('open-create-post-btn').style.display = "none";
});

backarrowBtn.addEventListener('click', () => {
    rulescreen.style.display = "none";
    mainPage.style.display = "block";
    settingBtn.style.display = "flex"; 
    document.getElementById('open-create-post-btn').style.display = "flex";
});


// ====== 📝 CREATE POST SCREEN LOGIC (OPEN / CLOSE) ======
const openCreatePostBtn = document.getElementById('open-create-post-btn');
const closeCreatePostBtn = document.getElementById('close-create-post-btn');
const createPostScreen = document.getElementById('createPostScreen');

openCreatePostBtn.addEventListener('click', () => {
    createPostScreen.style.flexDirection = "column";
    createPostScreen.style.display = "flex";
    openCreatePostBtn.style.display = "none"; 
    settingBtn.style.display = "none"; 
});

closeCreatePostBtn.addEventListener('click', () => {
    createPostScreen.style.display = "none";
    openCreatePostBtn.style.display = "flex"; 
    settingBtn.style.display = "flex";
});


// ====== 💬 COMMENT PAGE LOGIC ======
function openCommentPage(postId) {
    currentPostId = postId;
    const post = allPosts.find(p => p.id === postId);
    
    if(!post) return;

    document.getElementById('focusedPostText').innerText = post.text;
    const cListDiv = document.getElementById('commentList');
    cListDiv.innerHTML = '';

    if (post.comments && post.comments.length > 0) {
        post.comments.forEach(comment => {
            const cItem = document.createElement('div');
            cItem.className = 'comment-item';
            cItem.innerText = "❤️ " + comment;
            cListDiv.appendChild(cItem);
        });
    } else {
        const t = translations[currentLang];
        cListDiv.innerHTML = `<p style="color: #666; text-align: center;">${t.noComments}</p>`;
    }

    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('commentPage').style.display = 'block';
    openCreatePostBtn.style.display = "none";
    settingBtn.style.display = "none";
    window.scrollTo(0, 0); 
}

function goToMainPage() {
    currentPostId = null;
    document.getElementById('commentPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
    openCreatePostBtn.style.display = "flex";
    settingBtn.style.display = "flex";
    loadPosts(); 
}

async function submitComment() {
    const commentInput = document.getElementById('commentText');
    const commentText = commentInput.value.trim();
    const t = translations[currentLang];

    if (!commentText || !currentPostId) {
        await showCustomAlert(t.alertEmptyComment);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${currentPostId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: commentText })
        });

        const result = await response.json();

        if (result.success) {
            commentInput.value = ''; 
            await loadPosts();
            openCommentPage(currentPostId); 
        }
    } catch (error) {
        await showCustomAlert(t.alertCommentFail);
    }
}

applyLanguage();
checkAppStatus();

setInterval(checkAppStatus, 3000);
setInterval(loadPosts, 5000);
