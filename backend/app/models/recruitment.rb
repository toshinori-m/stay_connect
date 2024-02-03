class Recruitment < ApplicationRecord
  belongs_to :sports_type
  belongs_to :user
  belongs_to :prefecture

  has_many :recruitment_target_ages, dependent: :destroy
  has_many :target_ages,  through: :recruitment_target_ages
  has_many :recruitment_sports_disciplines, dependent: :destroy
  has_many :sports_disciplines, through: :recruitment_sports_disciplines

  validates :name, presence: true
  validates :area, presence: true, length: { maximum: 255 }
  enum sex: { man: 0, woman: 1, mix: 2, man_and_woman: 3 }
  validates :sex, presence: true
  validates :number, presence: true, numericality: { greater_than: 0 }
  validate :date_before_start
  validates :end_date, comparison: { greater_than_or_equal_to: :start_date }, presence: true
  validates :purpose_body, presence: true
  
  def date_before_start
    return if start_date.blank?
    errors.add(:start_date, "今日以降の日付を選択してください") if start_date < Date.today
  end
end
