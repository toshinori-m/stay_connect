class UpdateUsersAdd < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :provider, true
    change_column_null :users, :allow_password_change, true
  end
end
