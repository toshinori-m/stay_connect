json.array! @chat_rooms do |chat_room|
  json.id chat_room.id
  json.paid_or_free chat_room.paid_or_free
end
