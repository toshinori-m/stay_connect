json.array! @chat_messages do |chat_message|
  json.id chat_message.id
  json.message chat_message.message
  json.user_id chat_message.user.id
  json.name chat_message.user.name
  json.email chat_message.user.email
  json.created_at chat_message.created_at
end
