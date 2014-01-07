class AddCoffeebeanidToComments < ActiveRecord::Migration
  def self.up
    add_column :comments, :coffeebean_id, :integer
  end

  def self.down
    remove_column :comments, :coffeebean_id
  end
end
