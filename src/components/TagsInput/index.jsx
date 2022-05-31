import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import CloseIcon from '../../assets/images/icon-close.svg';

const TagsInput = ({tags,name, onTagSelected}) => {
    const [text, setText] = useState('');
    const [selectedTags, setSelectedTags]=useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    // const [tags, setTags] = useState([
    //     {id: 1, name: "Traditional Typical Nepalese House"},
    //     {id: 2, name: "Modern House"},
    //     {id: 3, name: "Semi Mordern House"},
    //     {id: 4, name: "European Style House"},
    //     {id: 5, name: "Pillar System"},
    //     {id: 6, name: "Wall System"},
    //     {id: 7, name: "Basement"}
    // ]);

    const [tagsDropdownActive, setTagsDropdownActive] = useState(false)

    useEffect(()=>{
        setFilteredTags(tags);
    },[])

    useEffect(()=>{
        const tags =checkForSelectedTags();
        setFilteredTags(tags)
    },[selectedTags])

    const onTagSelect = (item) => {
        setSelectedTags([...selectedTags, item]);

        // console.log(tagList);
        // setFilteredTags(tagList);
        checkForSelectedTags();
        onTagSelected([...selectedTags, item])
    }
    // const filteredList = () => {
    //     const filterd
    // }

    const onSelectedTagRemove = (tag) => {
        const filteredTags =  selectedTags.filter((item)=> item.id !== tag.id);
        setSelectedTags(filteredTags)
        var result = checkForSelectedTags();
        setFilteredTags(result);
        onTagSelected(filteredTags)
    }

    const checkForSelectedTags = () => {
        var result = tags.filter(f1=>{
            // filter selected (!) items in tags
            return !selectedTags.some(function(f2){
                return f1.id === f2.id;          // assumes unique id
            });
        });
        return result;
    }
    const onFilterTextFocus = () => {
        setTagsDropdownActive(true)
        setFilteredTags(tags);
        if(text){
            let result = [];
            if(selectedTags.length > 0){
              result = checkForSelectedTags()
            }else{
                result = tags.filter(item=>item.name.toLowerCase().includes(text.toLowerCase()));
            }
            setFilteredTags(result);
        }else{
            let result = [];
            if(selectedTags.length > 0){
                result = checkForSelectedTags()
                setFilteredTags(result);
            }else{
                setFilteredTags(tags);
            }
        }
    }


    const filteredText = (e) => {
        const result = filteredTags.filter(item=>item.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setFilteredTags(result);
    }

    return(
        <div className='c-tags-input relative'>
            <div className='border border-gray-300 p-2 flex flex-wrap'>
                <div className='px-2 flex flex-wrap items-center'>
                    {selectedTags && selectedTags.map((item,i)=> (

                        <span className='mr-2 bg-blue-200 inline-block px-2 py-1 text-sm rounded-full overflow-hidden whitespace-nowrap text-ellipsis mb-1 pr-8 relative' style={{maxWidth:'150px'}} key={i}>{item.name} 
                            <span className='bg-red-300 hover:bg-red-400 cursor-pointer rounded-full p-1 inline-block absolute right-2 top-1' style={{top:'5px'}} onClick={()=>onSelectedTagRemove(item)}>
                                <img src={CloseIcon} alt="close" width="10"/>
                            </span>
                        </span>))
                    }
                    <input type={'text'} name={name?name:'tags'} placeholder='enter text' className='inline-block px-2 mb-1' style={{maxWidth:'100px', height:'30px'}} onChange={filteredText} onFocus={()=> onFilterTextFocus()}/>
                </div>
               
            </div>
            {tagsDropdownActive &&
            <div className="absolute top-full left-0 right-0 tags-dropdown px-4 py-4 z-20 text-sm">
                {filteredTags && filteredTags.map((tag,i)=>{
                    
                    return (<div key={i} className={`cursor-pointer py-2  hover:opacity-70 ${i < tags.length - 1?'border-b border-gray-300':''}`} onClick={()=>onTagSelect(tag)}>{tag.name}</div>)
                })}
            </div>
            }

            {tagsDropdownActive &&  <div className='bg-black fixed inset-0 z-10 opacity-0' onClick={()=> setTagsDropdownActive(false)}></div>}
        </div>
    )
}



export default TagsInput