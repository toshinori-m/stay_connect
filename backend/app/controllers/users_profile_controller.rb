class UsersProfileController < ApplicationController
  before_action :authenticate, only: [:show]

  def show
    @user = User.find(params[:id])
  end
end
