json.chat_room do
  json.id @chat_room.id
  json.paid_or_free @chat_room.paid_or_free
end

json.other_user do
  json.id @other_user.id
  json.name @other_user.name
end
