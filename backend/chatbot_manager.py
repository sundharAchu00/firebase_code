def get_response(message):
    if message.lower() == "hello":
        return "Hello! how can i help you?"
    elif message.lower() == "what can you do?":
        return "I can help you to manage the crew"
    elif message.lower() == "run the crew":
        return "Running the crew, please wait..."
    else:
        return "I dont understand you, please try again"