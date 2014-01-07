class AddLikesToCoffeebean < ActiveRecord::Migration
  def self.up
    add_column :coffeebeans, :likes, :integer, :default => 0
  end

  def self.down
    remove_column :coffeebeans, :likes
  end
end
