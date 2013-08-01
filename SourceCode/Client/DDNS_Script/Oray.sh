#!/bin/sh -                                                                     
USER="1528studio"                                                                  
PASS="1528psw"                                                            
DOMAIN="1528studio.eicp.net"
URL="http://${USER}:${PASS}@ddns.oray.com:80/ph/update?hostname=${DOMAIN}"

while true
do
{
	echo "Regist to Ory with URL:\n\t${DOMAIN}"

	curl ${URL}

	echo "\nSleeping\n"
	
	sleep 60s
}
done


#curl http://1528studio:1528psw@ddns.oray.com:80/ph/update?hostname=1528studio.eicp.net