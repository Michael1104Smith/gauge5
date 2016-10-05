function GaugeBorder(placeholderName, configuration)
{
	this.placeholderName = placeholderName;
	
	var self = this; // for internal d3 functions
	
	this.configure = function(configuration)
	{
		this.config = configuration;
		
		this.config.size = this.config.size * 0.9;
		
		this.config.raduis = this.config.size * 0.97 / 2;
		this.config.cx = this.config.size / 2;
		this.config.cy = this.config.size / 2;
		
		this.config.min = undefined != configuration.min ? configuration.min : 0; 
		this.config.max = undefined != configuration.max ? configuration.max : 100; 
		this.config.range = this.config.max - this.config.min;
		this.config.ValueFontSize = configuration.ValueFontSize || 32;
		this.config.LabelFontSize = configuration.LabelFontSize || 32;
		this.config.MaxValueFontSize = configuration.MaxValueFontSize || 16;

		this.config.backColor 	= configuration.backColor || "#e6e6e6";
		this.config.foreColor = configuration.foreColor || "#a0d771";
		this.config.cur_val = configuration.cur_val;
		this.config.max_val = configuration.max_val || 20;
		this.config.min_val = configuration.min_val || 0;
		this.config.label = configuration.label || "Sales 2015";
		this.config.prefix = configuration.prefix;
		this.config.postfix = configuration.postfix;
		
		this.config.transitionDuration = configuration.transitionDuration || 500;
	}

	this.render = function()
	{
		postfix = this.config.postfix;
		prefix = this.config.prefix;
		var chartId = "#" + this.placeholderName;
		$(chartId).html("");
		this.body = d3.select("#" + this.placeholderName)
							.append("svg:svg")
							.attr("class", "gauge")
							.attr("width", this.config.size*1.1)
							.attr("height", this.config.size*1.1);

		max_val = this.config.max_val;
		min_val = this.config.min_val;
		cur_val = this.config.cur_val;
		backColor = this.config.backColor;
		foreColor = this.config.foreColor;

		this.drawBand(0, 100, backColor, 0.6, 0.9, 360, 0);
		console.log(max_val);

		if(cur_val<=max_val && cur_val>min_val){
			if(max_val != 0){
				var val_pos = 100/(max_val-min_val)*(cur_val-min_val);
				this.drawBand(0, val_pos, foreColor, 0.6, 0.9, 360, 0);
			}
		}else if(cur_val>max_val){
			this.drawBand(0, 100, foreColor, 0.6, 0.9, 360, 0);
		}
		else{
			this.drawBand(0, 0, foreColor, 0.6, 0.9, 360, 0);
		}
		

		fontSize = this.config.ValueFontSize;

		this.body.append("svg:text")
					.attr("x", this.config.cx)
					.attr("y", this.config.cy)
					.attr("dy", fontSize / 2)
					.attr("text-anchor", "middle")
					.text(prefix+cur_val+postfix)
					.style("fill",foreColor)
					.style("font-size", fontSize + "px");

		fontSize = this.config.MaxValueFontSize;

		this.body.append("svg:text")
					.attr("x", this.config.cx/2*3)
					.attr("y", fontSize/3)
					.attr("dy", fontSize / 2)
					.attr("text-anchor", "middle")
					.style("fill",backColor)
					.text(prefix+min_val+postfix)
					.style("font-size", fontSize + "px");
		this.body.append("svg:text")
					.attr("x", this.config.cx/2)
					.attr("y", fontSize/3)
					.attr("dy", fontSize / 2)
					.attr("text-anchor", "middle")
					.style("fill",backColor)
					.text(prefix+max_val+postfix)
					.style("font-size", fontSize + "px");

		fontSize = this.config.LabelFontSize;
		label = this.config.label;

		this.body.append("svg:text")
					.attr("x", this.config.cx)
					.attr("y", this.config.size - fontSize/5)
					.attr("dy", fontSize / 2)
					.attr("text-anchor", "middle")
					.text(label)
					.style("font-size", fontSize + "px");
	}
	
	this.drawBand = function(start, end, color, inner_radius, outer_radius, value1, value2)
	{
		if (0 >= end - start) return;
		
		this.body.append("svg:path")
					.style("fill", color)
					.attr("d", d3.svg.arc()
						.startAngle(this.valueToRadians(start, value1, value2))
						.endAngle(this.valueToRadians(end, value1, value2))
						.innerRadius(inner_radius * this.config.raduis)
						.outerRadius(outer_radius * this.config.raduis))
					.attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate("+value1+")" });
	}
	
	this.valueToDegrees = function(value, value1, value2)
	{
		// thanks @closealert
		//return value / this.config.range * 270 - 45;
		return value / this.config.range * value1 - (this.config.min / this.config.range * value1 + value2);
	}
	
	this.valueToRadians = function(value, value1, value2)
	{
		return this.valueToDegrees(value, value1, value2) * Math.PI / 180;
	}
	// initialization
	this.configure(configuration);	
}