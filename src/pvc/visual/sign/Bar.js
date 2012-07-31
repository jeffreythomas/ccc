
def.type('pvc.visual.Bar', pvc.visual.Sign)
.init(function(panel, protoMark, keyArgs){

    var pvMark = protoMark.add(pv.Bar);
    
    this.base(panel, pvMark, keyArgs);

    this.normalStroke = def.get(keyArgs, 'normalStroke', false);

    this/* Colors */
        .intercept('fillStyle',   'fillColor'  )
        .intercept('strokeStyle', 'strokeColor')
        .intercept('lineWidth',   'strokeWidth')
        ;
})
.add({
    /* COLOR */
    fillColor: function(){ 
        return this.color('fill');
    },
    
    strokeColor: function(){
        return this.color('stroke');
    },

    /**
     * @override
     */
    normalColor: function(type, color){
        if(type === 'stroke' && !this.normalStroke){
            return null;
        }

        return color;
    },

    /**
     * @override
     */
    interactiveColor: function(type, color){
        var scene = this.scene;
        
        if(type === 'stroke'){
            if(scene.isActive){
               return color.brighter(1.3).alpha(0.7);
            }
            if(!this.normalStroke){
                return null;
            }

            if(scene.anySelected() && !scene.isSelected()) {
                if(this.isActiveSeriesAware && scene.isActiveSeries()) {
                    return pv.Color.names.darkgray.darker().darker();
                }

                return this.dimColor(type, color);
            }

        } else if(type === 'fill'){
            if(scene.isActive) {
                return color.brighter(0.2).alpha(0.8);
            } 

            if(scene.anySelected() && !scene.isSelected()) {
                if(this.isActiveSeriesAware && scene.isActiveSeries()) {
                    return pv.Color.names.darkgray.darker(2).alpha(0.8);
                }

                return this.dimColor(type, color);
            }
        }

        return this.base(type, color);
    },

    /* STROKE WIDTH */
    strokeWidth: function(){
        var strokeWidth = this.baseStrokeWidth();
        if(this.scene.anyInteraction()) {
            strokeWidth = this.interactiveStrokeWidth(strokeWidth);
        } else {
            strokeWidth = this.normalStrokeWidth(strokeWidth);
        }

        return strokeWidth;
    },

    baseStrokeWidth: function(){
        var value = this.delegate();
        if(value === undefined){
            value = this.defaultStrokeWidth();
        }

        return value;
    },

    defaultStrokeWidth: function(){
        return 0.5;
    },

    normalStrokeWidth: function(strokeWidth){
        return strokeWidth;
    },

    interactiveStrokeWidth: function(strokeWidth){
        if(this.scene.isActive){
            return Math.max(1, strokeWidth) * 1.3;
        }

        return strokeWidth;
    }
});
