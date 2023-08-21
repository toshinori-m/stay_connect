class CreateRecruitments < ActiveRecord::Migration[7.0]
  def change
    create_table :recruitments do |t|
      ## Required
      t.string :name, :null => false
      t.string :area, :null => false
      t.integer :sex, :null => false, :default => "0"
      t.integer :number, :null => false
      t.date :start_date, :null => false
      t.date :end_date, :null => false
      t.text :purpose_body, :null => false

      ## User Info
      t.references :user
      t.references :sports_type
      t.string :image
      t.text :other_body
      t.timestamps
    end
  end
end
