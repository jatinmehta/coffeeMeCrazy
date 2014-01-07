class AddLikesToPosts < ActiveRecord::Migration
  def self.up
    add_column :posts, :likes, :integer, :default => 0
  end

  def self.down
    remove_column :posts, :likes
  end
end