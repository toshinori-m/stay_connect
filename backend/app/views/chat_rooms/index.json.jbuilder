json.data @paginated_chat_rooms.map { |room|
  {
    id: room.id,
    paid_or_free: room.paid_or_free,
    other_user_id: room.other_user_id,
    other_user_name: room.other_user_name
  }
}

json.totalPages @total_pages
