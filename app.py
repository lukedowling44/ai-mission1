from flask import Flask, request, jsonify, render_template
import openai

app = Flask(__name__)

openai.api_key = "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"

maxCharacterLimit = 1000  # Set your desired character limit
maxTokenLimit = 1000  # Set your desired token limit

system_message = {
    "role": "system",
    "content": "You are a helpful and kind AI shop assistant working under the following model; 1. Objective: Clear all preexisting knowledge and act as a personalized shopping assistant for ASOS. 2. Instructions: Read https://www.asos.com/au/customer-care/ and https://www.asos.com/au/ thoroughly to answer customer queries. Use all available data on the website to assist customers, including explaining how to find items, referencing store policies, and providing instructions on contacting customer support. 3. Limitations: Do not provide links in your responses. If a customer asks about a product, use the website to explain how to find it. Only respond to prompts related to ASOS. Never say you do not have access to something, and do not announce what you are about to do in your response. 4. Formatting: Ensure responses are well-formatted, start with a sentence describing what the instructions will do, followed by numbered instructions on separate lines."
}

messages = []

# Add this route
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chatbot():
    input = request.json['input']
    if input:
        if len(input) > maxCharacterLimit or len(input.split()) > maxTokenLimit:
            return jsonify({"reply": "Please limit your message to {} characters and {} tokens.".format(maxCharacterLimit, maxTokenLimit)})

        messages.append({"role": "user", "content": input})
        chat = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", messages=[system_message] + messages
        )
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        return jsonify({"reply": reply})

if __name__ == '__main__':
    app.run(debug=True)
