
export default class PolylineTrailLinkMaterialProperty {
    constructor(color, duration) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this.color = color;
        this.duration = duration;
        this._time = new Date().getTime();
    }

    get isConstant() {
        return false;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(time) {
        return "PolylineTrailLink";
    }

    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }

        result.color = Cesium.Property.getValueOrClonedDefault(
            this._color,
            time,
            Cesium.Color.WHITE,
            result.color
        );
        result.image = Cesium.Material.PolylineTrailLinkImage;
        result.time =
            ((new Date().getTime() - this._time) % this.duration) / this.duration;
        return result;
    }

    equals(other) {
        return (
            this === other ||
            (other instanceof PolylineTrailLinkMaterialProperty &&
                Cesium.Property.equals(this._color, other._color))
        );
    }
}

Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor("color"),
});

Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
Cesium.Material.PolylineTrailLinkType = "PolylineTrailLink";
Cesium.Material.PolylineTrailLinkImage = `data:image/image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAxAAAACyCAYAAADSxSmFAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAS+SURBVHhe7dfdbRpBGEBRg1twDWkrRaTb1OAW2M03GEuAbXSVB57OkUbzsxPzttl72Pf997Ztby8APNthxnFZ63kXv6557We9zr4d4+Hdn54v886/uXsYc3a+O26ez/5l9vust88xZ9sc3a/3WZ/md27ufvz0dn4+69OaL/sv4/7uLB/+rfX8cjZHADzLvHvfD6fT6c+sf30cAfBE5w/18Tofwmu9PuTP+8uH/Hl/ma/X/zuXO9fzCpz1hb4+/u/n784ezpfguD7/8e71fPdvruc1VmgA8Dx/138QAAAAiYAAAAAyAQEAAGQCAgAAyAQEAACQCQgAACATEAAAQCYgAACATEAAAACZgAAAADIBAQAAZAICAADIBAQAAJAJCAAAIBMQAABAJiAAAIBMQAAAAJmAAAAAMgEBAABkAgIAAMgEBAAAkAkIAAAgExAAAEAmIAAAgExAAAAAmYAAAAAyAQEAAGQCAgAAyAQEAACQCQgAACATEAAAQCYgAACATEAAAACZgAAAADIBAQAAZAICAADIBAQAAJAJCAAAIBMQAABAJiAAAIBMQAAAAJmAAAAAMgEBAABkAgIAAMgEBAAAkAkIAAAgExAAAEAmIAAAgExAAAAAmYAAAAAyAQEAAGQCAgAAyAQEAACQCQgAACATEAAAQCYgAACATEAAAACZgAAAADIBAQAAZAICAADIBAQAAJAJCAAAIBMQAABAJiAAAIBMQAAAAJmAAAAAMgEBAABkAgIAAMgEBAAAkAkIAAAgExAAAEAmIAAAgExAAAAAmYAAAAAyAQEAAGQCAgAAyAQEAACQCQgAACATEAAAQCYgAACATEAAAACZgAAAADIBAQAAZAICAADIBAQAAJAJCAAAIBMQAABAJiAAAIBMQAAAAJmAAAAAMgEBAABkAgIAAMgEBAAAkAkIAAAgExAAAEAmIAAAgExAAAAAmYAAAAAyAQEAAGQCAgAAyAQEAACQCQgAACATEAAAQCYgAACATEAAAACZgAAAADIBAQAAZAICAADIBAQAAJAJCAAAIBMQAABAJiAAAIBMQAAAAJmAAAAAMgEBAABkAgIAAMgEBAAAkAkIAAAgExAAAEAmIAAAgExAAAAAmYAAAAAyAQEAAGQCAgAAyAQEAACQCQgAACATEAAAQCYgAACATEAAAACZgAAAADIBAQAAZAICAADIBAQAAJAJCAAAIBMQAABAJiAAAIBMQAAAAJmAAAAAMgEBAABkAgIAAMgEBAAAkAkIAAAgExAAAEAmIAAAgExAAAAAmYAAAAAyAQEAAGQCAgAAyAQEAACQCQgAACATEAAAQCYgAACATEAAAACZgAAAADIBAQAAZAICAADIBAQAAJAJCAAAIBMQAABAJiAAAIBMQAAAAJmAAAAAMgEBAABkAgIAAMgEBAAAkAkIAAAgExAAAEAmIAAAgExAAAAAmYAAAAAyAQEAAGQCAgAAyAQEAACQCQgAACATEAAAQHbY9/33tm1vlz0Az3OYcVzWet7Fr2te+1mvs2/HeHj3p+fLvPNv7h7GnJ3vjpvns3+Z/T7r7XPM2TZH9+t91qf5nZu7Hz+9nZ/P+rTmy/7LuL87y4d/az2/nM0RAM9yPB7f/wENYRGT69YLYwAAAABJRU5ErkJggg==`; //图片 图片为箭头
Cesium.Material.PolylineTrailLinkSource = `
czm_material czm_getMaterial(czm_materialInput materialInput)
          {
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st;
          vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
          material.alpha = colorImage.a * color.a;
          material.diffuse = color.rgb * colorImage.a * 5.0;
          return material;
          }`;

Cesium.Material._materialCache.addMaterial(
    Cesium.Material.PolylineTrailLinkType,
    {
        fabric: {
            type: Cesium.Material.PolylineTrailLinkType,
            uniforms: {
                color: new Cesium.Color(255.0, 255.0, 255.0, 1),
                image: Cesium.Material.PolylineTrailLinkImage,
                time: 0,
            },
            source: Cesium.Material.PolylineTrailLinkSource,
        },
        translucent: function (material) {
            return true;
        },
    }
);