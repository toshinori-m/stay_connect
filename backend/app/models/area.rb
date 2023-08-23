class Area < ApplicationRecord
  has_one :recruitment
  has_one :team

  validates :name, presence: true
end
