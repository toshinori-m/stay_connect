class CreateSportsTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :sports_types do |t|
      ## Required
      t.string :name, :null => false

      ## User Info
      t.references :user
      t.string :name
      t.timestamps
    end
  end
end
