import Push from 'pushover-notifications'


export const pushoverNotification = (message)=>{
  var p = new Push( {
    user: "utj8s3uuxhipd6vss27uguymhp1zsu", // 
    token: "ad4zjg65yvquvane15ju98ebjhu888",
    // httpOptions: {
    //   proxy: process.env['http_proxy'],
    //},
    // onerror: function(error) {},
    // update_sounds: true // update the list of sounds every day - will
    // prevent app from exiting.
  })

  var msg = {
    // These values correspond to the parameters detailed on https://pushover.net/api
    // 'message' is required. All other values are optional.
    message: message ,	// required
    title: "Bosta URL Monitor API",
    sound: 'magic',
    device: 'devicename',
    priority: 1
  }

try{
  p.send( msg, function( err, result ) {
    if ( err ) {
      throw err
    }

    console.log( result )
  }
  )
}catch(e){
  console.log(e)
}
}