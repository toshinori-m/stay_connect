class CreateChatRooms < ActiveRecord::Migration[7.0]
  def change
    create_table :chat_rooms do |t|
      ## Required
      t.boolean :paid_or_free, :null => false

      ## User Info
      t.timestamps
    end
  end
end
