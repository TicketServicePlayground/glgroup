export const findAnchors = (data) => {
    let result = [];

    const traverseContent = (content) =>{
        if(Array.isArray(content)) {
            content.forEach((item) => traverseContent(item));
        }else if(typeof content === 'object'){
            if(content.marks){
                content.marks.forEach((mark)=>{
                    if(mark.type === 'anchor'){
                        result.push(content);
                    }
                })
            }
            if(content.content){
                traverseContent(content.content);
            }
        }
    }
    if (!Array.isArray(data)) return result;
    data.map((item)=>{
        traverseContent(item.richText);
    })

    return result;
}