function getHttpRequest() {
	var xmlHttp = null;
	try{
		// Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();
	} catch (e) {
		// Internet Explorer
		try{
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		}catch (e){
			try{
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}catch(e){
			}
		}
	}	
	return xmlHttp;
}

WebFun_get = function ( url ) {
	var xmlHttp = getHttpRequest();
	xmlHttp.open("GET", url);
	xmlHttp.send(null);
}