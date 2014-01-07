class CreateCoffeebeans < ActiveRecord::Migration
  def self.up
    create_table :coffeebeans do |t|
      t.string :name
      t.text :description
      t.string :place

      t.timestamps
    end
  end

  def self.down
    drop_table :coffeebeans
  end
end
