class RemoveUserIdFromSportsTypes < ActiveRecord::Migration[7.0]
  def change
    remove_column :sports_types, :user_id, :bigint
  end
end
