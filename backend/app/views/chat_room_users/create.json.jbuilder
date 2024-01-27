json.data do
  json.extract! @chat_room_user, :id, :chat_room_id, :user_id, :created_at, :updated_at
end
