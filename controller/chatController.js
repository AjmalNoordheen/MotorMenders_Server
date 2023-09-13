const UserSchema = require("../Model/userSchema")
const chatSchema = require('../Model/chatSchema')
const proSchema = require('../Model/mechanicSchema')


const loadChat = async(req,res)=>{
    try {
        const {email,proId,type,id} = req.query
        let user
        if(type=='user'){
            const chat = await chatSchema.findOne({
                $and:[
                    {user:user._id},
                    {professional:proId}
                ]
            })
            if(chat){
                
                res.status(200).json({chat})
            }else{
                const chat = await chatSchema.create({
                    user:user._id,
                    professional:proId,
                    read_at:true
                })
    
                res.status(200).json({chat})
            }
            // if Professional sends the messege
        }
        
        // else if(type=='proffesional'){
        //     proId = await proSchema.findOne({email:email})
        //     const chat = await chatSchema.findOne({
        //         $and:[
        //             {user:user._id},
        //             {professional:proId}
        //         ]
        //     })
        //     if(chat){
        //         res.status(200).json({chat})
        //     }else{
        //         const chat = await chatSchema.create({
        //             user:user._id,
        //             professional:proId,
        //             read_at:true
        //         })
    
        //         res.status(200).json({chat})
        //     }
        // }
       

      
    } catch (error) {
        res.status(500).json({ errMsg: 'Server error' })
    }
}


const fetchMessages = async(req,res)=>{
    try {
        const id = req.query.id
        const chat = await chatSchema.findOne({_id:id})
        console.log(chat);
        if(chat){
            res.json(chat)
        }
    } catch (error) {
        
    }
}

// ============================== addMessage or send MEssage==================
const addMessage = async(message,chatId)=>{
    try {
        const updateChat = await chatSchema.updateOne({_id:chatId},{$push:{
            messages:{
                text:message.text,
                senderType:message.senderType,
                senderId:message.senderId,
                receiverId:message.receiver,
                timestamp:message.timestamp
            }
        }})
    } catch (error) {
        console.log(error);
    }
}
// ===================== listChat ==================

const listChat = async(req,res)=>{
    try {
        const {id,senderType,proId} = req.query
        let list
        if(senderType=='professional'){
            
            const pro = await proSchema.findOne({_id:id})    
            list = await chatSchema.find({professional:pro._id}).populate('user')
        }else{
            const user = await UserSchema.findOne({_id:id})
            if(proId){
                const chat = await chatSchema.findOne({
                    $and:[
                        {user:user._id},
                        {professional:proId}
                    ]
                })
                if(!chat){
                  
                    const chat = await chatSchema.create({
                        user:user._id,
                        professional:proId,
                        read_at:true
                    })
        
                }

            }
            const responseData = await chatSchema.find({user:id}).populate('professional')
                list = responseData.filter( data=>(data.messages.length>0 || data.professional._id == proId ))

                console.log(list);
           
        }
        if(list){
            res.status(200).json({list})
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports={loadChat,addMessage,listChat,fetchMessages}