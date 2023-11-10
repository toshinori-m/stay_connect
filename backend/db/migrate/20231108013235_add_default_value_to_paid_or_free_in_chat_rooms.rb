class AddDefaultValueToPaidOrFreeInChatRooms < ActiveRecord::Migration[7.0]
  def change
    change_column_default :chat_rooms, :paid_or_free, false
  end
end
