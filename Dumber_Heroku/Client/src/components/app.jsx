import React from 'react';
import axios from 'axios';
import $ from 'jQuery';
// import reactStringReplace from 'react-string-replace';


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {     
        };
        this.clickedWord = this.clickedWord.bind(this);
        this.requestWord = this.requestWord.bind(this);
    }

    componentDidMount() {
        this.clickedWord();
    }

    clickedWord() {

        let request = this.requestWord;

        $(document).on('click', function(e){
            let s = window.getSelection();
            let range = s.getRangeAt(0);
            let node = s.anchorNode;
        
            console.log('clicked');

            // console.log(range.startOffset, range.endOffset, node.length, s);

            //while 1. there's no space at the beginning and 2. if it's the first word of the doc, we're at the first spot
            while(range.toString().indexOf(' ') > 0 || (range.startOffset > 0 && range.toString().indexOf(' ') === -1)) { 
                range.setStart(node,(range.startOffset -1));
            }

            if(range.toString().indexOf(' ') === 0){ range.setStart(node, range.startOffset +1); }
            do{
                if (range.endOffset < node.length){
                    range.setEnd(node,range.endOffset + 1);
                    // console.log(range.toString(), ' and loc of " " is ', range.toString().indexOf(' '));
                }
            } while(range.toString().indexOf(' ') === -1 && range.toString().trim() !== '' && range.endOffset < node.length);
            // console.log('last letter is _', range.toString().substring(range.toString().length -1), "_")
            if (range.toString().substring(range.toString().length -1) === ' ' ||
                range.toString().substring(range.toString().length -1) === '.' ||
                range.toString().substring(range.toString().length -1) === ',' ||
                range.toString().substring(range.toString().length -1) === ':' ||
                range.toString().substring(range.toString().length -1) === ';' ||
                range.toString().substring(range.toString().length -1) === '?' ||
                range.toString().substring(range.toString().length -1) === '!' ||
                range.toString().substring(range.toString().length -1) === '-' 
                ){
                    range.setEnd(node,range.endOffset - 1);
            }
            var str = range.toString().trim();
            request(str, range);

        // alert(str);
        });
    }

    requestWord(text, range){
        // console.log('the text is ', text);
        axios.get('/api/dictionary', { params: { word: text } })
        .then(res => {
            console.log(res.data);
            // range.toString().replace(text, res.data);
            document.body.innerHTML = document.body.innerHTML.replace(text, text + ` [<span style="color: red;">${res.data}</span>]`);
        })

    }

    render () {
        return (
            <div className="clickable">
                The page has loaded.
            </div>
        )
    }   
}

export default App;