function toggleChatbox() {
    const chatboxCircle = document.querySelector('.chatbox-circle');
    const chatboxContainer = document.querySelector('.chatbox-container');
    chatboxContainer.classList.toggle('visible');
    chatboxCircle.style.display = chatboxContainer.classList.contains('visible') ? 'none' : 'flex';
}

function displayTypingDots() {
    const typingAnimation = $('<div>').addClass('message assistant-message typing-animation');
    const typingDots = $('<div>').addClass('typing-dots');
    for (let i = 0; i < 3; i++) {
        typingDots.append($('<span>'));
    }
    typingAnimation.append(typingDots);
    $('.messages-container').append(typingAnimation);
    $('.messages-container').scrollTop($('.messages-container')[0].scrollHeight);
    return typingAnimation;
}

function printResponse(response, delay) {
    const words = response.split(' ');
    let idx = 0;
    const printNextWord = () => {
        if (idx < words.length) {
            const assistantMessage = $('.assistant-message').last();
            assistantMessage.text(assistantMessage.text() + ' ' + words[idx]);
            idx++;
            setTimeout(printNextWord, delay);
        } else {
            $('#submit').prop('disabled', false);
        }
    };
    printNextWord();
}

function submitPrompt() {
    const input = $("#input").val();
    if (input) {
        $('#submit').prop('disabled', true);
        $.ajax({
            url: "/api/chat",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ input: input }),
            success: function(response) {
                $("#input").val("");
                const userMessage = $("<div>").addClass("message user-message").text(input);
                $(".messages-container").append(userMessage);
                $(".messages-container").scrollTop($(".messages-container")[0].scrollHeight);
                
                const typingAnimation = displayTypingDots();

                setTimeout(() => {
                    typingAnimation.remove();
                    const assistantMessage = $("<div>").addClass("message assistant-message").text('');
                    $(".messages-container").append(assistantMessage);
                    printResponse(response.reply, 100);
                }, 1000);
            },
            error: function() {
                alert("An error occurred. Please try again.");
            }
        });
    }
}

$(document).ready(function() {
    $("#submit").on("click", submitPrompt);
    $("#input").on("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            submitPrompt();
        }
    });
});
