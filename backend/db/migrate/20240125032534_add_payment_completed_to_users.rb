class AddPaymentCompletedToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :payment_completed, :boolean, default: false, null: false
  end
end
