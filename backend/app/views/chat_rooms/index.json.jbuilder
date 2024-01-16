json.array! @chat_rooms_with_other_user do |chat_room_with_other_user|
  json.id chat_room_with_other_user[:chat_room].id
  json.paid_or_free chat_room_with_other_user[:chat_room].paid_or_free
  json.other_user_name chat_room_with_other_user[:other_user_name]
  json.other_user_id chat_room_with_other_user[:other_user_id]
end
