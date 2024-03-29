json.data do
  json.id @chat_message.id
  json.message @chat_message.message
  json.user_id @chat_message.user.id
  json.name @chat_message.user.name
  json.email @chat_message.user.email
  json.created_at @chat_message.created_at.strftime("%Y-%m-%d %H:%M:%S")
  json.read @chat_message.read
end
