function RangeRule(mapInstance) {
    let rule = null
    if (typeof AMap !== "undefined" && mapInstance) {
        var startMarkerOptions= {
            icon: new AMap.Icon({
                size: new AMap.Size(19, 31),//图标大小
                imageSize:new AMap.Size(19, 31),
                image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
            })
        };
        var endMarkerOptions = {
            icon: new AMap.Icon({
                size: new AMap.Size(19, 31),//图标大小
                imageSize:new AMap.Size(19, 31),
                image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
            }),
            offset: new AMap.Pixel(-9, -31)
        };
        var midMarkerOptions = {
            icon: new AMap.Icon({
                size: new AMap.Size(19, 31),//图标大小
                imageSize:new AMap.Size(19, 31),
                image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
            }),
            offset: new AMap.Pixel(-9, -31)
        };
        var lineOptions = {
            strokeStyle: "solid",
            strokeColor: "#FF33FF",
            strokeOpacity: 1,
            strokeWeight: 2
        };
        var rulerOptions = {
            startMarkerOptions: startMarkerOptions,
            midMarkerOptions:midMarkerOptions,
            endMarkerOptions: endMarkerOptions,
            lineOptions: lineOptions
        };
        rule = new AMap.RangingTool(mapInstance, rulerOptions);
    }
    return rule
}

export default RangeRule