class CreateTeams < ActiveRecord::Migration[7.0]
  def change
    create_table :teams do |t|
      ## Required
      t.string :name, :null => false
      t.string :area, :null => false
      t.integer :sex, :null => false, :default => "0"
      t.text :track_record, :null => false

      ## User Info
      t.references :user
      t.references :sports_type
      t.references :prefecture
      t.text :other_body
      t.timestamps
    end
  end
end
