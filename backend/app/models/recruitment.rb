class Recruitment < ApplicationRecord
  belongs_to :sports_type
  belongs_to :user
  belongs_to :area

  has_many :recruitment_target_ages

  validates :name, presence: true
  validates :area, presence: true
  enum sex: { man: 0, woman: 1, mix: 2 }
  validates :sex, presence: true, numericality: { only_integer: true }
  validates :number, presence: true, numericality: { greater_than: 0 }
  validates :start_date, date: true, presence: true
  validates :end_date, date: true, presence: true
  validates :purpose_body, presence: true
end
