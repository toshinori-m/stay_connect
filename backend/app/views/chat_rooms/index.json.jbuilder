json.data @paginated_chat_rooms.map { |room|
  {
    id: room[:chat_room].id,
    paid_or_free: room[:chat_room].paid_or_free,
    other_user_name: room[:other_user_name],
    other_user_id: room[:other_user_id]
  }
}

json.totalPages @total_pages