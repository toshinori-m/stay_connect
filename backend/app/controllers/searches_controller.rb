class SearchesController < ApplicationController
  before_action :authenticate, only: [:index]

  def index
    @recruitments = Recruitment.all
    @recruitments = @recruitments.joins(:sports_disciplines).where(sports_disciplines: { name: params[:sports_discipline_name] }) if params[:sports_discipline_name].present?
    @recruitments = @recruitments.joins(:prefecture).where(prefectures: { name: params[:prefecture_name] }) if params[:prefecture_name].present?
    @recruitments = @recruitments.joins(:target_ages).where(target_ages: { name: params[:target_age_name] }) if params[:target_age_name].present?
    @recruitments = @recruitments.joins(:sports_type).where(sports_types: { name: params[:sports_type_name] }) if params[:sports_type_name].present?
    
    @recruitments = @recruitments.includes(:prefecture, :sports_disciplines, :target_ages, :sports_type)
  end
end
