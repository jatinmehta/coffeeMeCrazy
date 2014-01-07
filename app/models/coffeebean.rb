class Coffeebean < ActiveRecord::Base
   validates :name, :presence => true
   validates :description, :presence => true
   validates :place, :presence => true

   has_many :comments, :dependent => :destroy
end
