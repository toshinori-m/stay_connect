json.array! @chat_room_users do |chat_room_user|
  json.extract! chat_room_user, :id, :chat_room_id, :user_id
end
