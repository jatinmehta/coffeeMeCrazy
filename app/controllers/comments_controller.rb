class CommentsController < ApplicationController
	def index
		@coffeebean = Coffeebean.find_by_id(params[:coffeebean_id])
		@comments = @coffeebean.comments
		
		respond_to do |format|
      		format.json { render :json => @comments }
      		format.html # index.html.erb
      	end
    end

	def new
		@coffeebean = Coffeebean.find_by_id(params[:coffeebean_id])
    	@comment = @coffeebean.comments.build
    	respond_to do |format|
      		format.html # new.html.erb
   	 	end
  	end

	def create
		@coffeebean = Coffeebean.find_by_id(params[:coffeebean_id])
		#@comment = @coffeebean.comments.build(params[:comment])

    @comment = Comment.new(params[:comment]);
    @comment.coffeebean_id = @coffeebean.id;
    	respond_to do |format|
      		if @comment.save
        		format.html { redirect_to(@coffeebean, :notice => 'Comment was successfully added') }
        		# /// 3
        		format.json { render :json => @comment}
      		else
        		format.html { render :action => "new" }
        		# /// 4
        		format.json { render :json => @comment.errors.to_a, :status => :unprocessable_entity }
      		end
      	end
		#@comment = @coffeebean.microcoffeebeans.build(params[:microcoffeebean])
		#if @microcoffeebean.save
		#	flash[:success] = "Microcoffeebean created!"
		#	redirect_to root_path
		#else

		#end
	end

	def destroy
	end
end