class CoffeebeansController < ApplicationController
  # /// 1
  def index
    @coffeebeans = Coffeebean.all

    respond_to do |format|
      format.json { render :json => @coffeebeans }
      format.html # index.html.erb
    end
  end

  # /// 2
  def show
    @coffeebean = Coffeebean.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
    end
  end

  def new
    @coffeebean = Coffeebean.new

    respond_to do |format|
      format.html # new.html.erb
    end
  end

  def edit
    @coffeebean = Coffeebean.find(params[:id])
  end

  def create
    @coffeebean = Coffeebean.new(params[:coffeebean])

    respond_to do |format|
      if @coffeebean.save
        format.html { redirect_to(@coffeebean, :notice => 'Coffeebean was successfully created.') }
        # /// 3
        format.json { render :json => @coffeebean}
      else
        format.html { render :action => "new" }
        # /// 4
        format.json { render :json => @coffeebean.errors.to_a, :status => :unprocessable_entity }
      end
    end
  end

  def update
    @coffeebean = Coffeebean.find(params[:id])

    respond_to do |format|
      if @coffeebean.update_attributes(params[:coffeebean])
        format.html { redirect_to(@coffeebean, :notice => 'Coffeebean was successfully updated.') }
        # /// 5
        format.json { render :json => @coffeebean}
      else
        format.html { render :action => "edit" }
        format.json { render :json => @coffeebean.errors.to_a, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @coffeebean = Coffeebean.find(params[:id])
    @coffeebean.destroy

    respond_to do |format|
      format.html { redirect_to(coffeebeans_url) }
      # /// 6
      format.json { render :json => 'ok'.to_json }
    end
  end
end
