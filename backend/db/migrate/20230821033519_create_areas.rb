class CreateAreas < ActiveRecord::Migration[7.0]
  def change
    create_table :areas do |t|
      ## Required
      t.string :name, :null => false

      ## User Info
      t.timestamps
    end
  end
end
