class CreateTeams < ActiveRecord::Migration[7.0]
  def change
    create_table :teams do |t|
      ## Required
      t.string :name, :null => false
      t.string :area, :null => false
      t.integer :sex, :null => false, :default => "0"
      t.string :track_record, :null => false

      t.references :user
      t.references :sports_type
      t.string :name
      t.string :area
      t.integer :sex
      t.text :track_record
      t.text :other_body
      t.timestamps
    end
  end
end
