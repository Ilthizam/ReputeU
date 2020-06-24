import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from "draft-convert";

/* 
====== Props =====
htmlData 
display - removes min height
toolbarHidden
readOnly
*/

class PostEditor extends Component {
  constructor(props) {
    super(props);
    let editorState = EditorState.createEmpty();

    const html = this.props.htmlData;
    if (html && html.length > 0) {
      const contentBlock = convertFromHTML(html);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      editorState = EditorState.createWithContent(contentState);
    }
    this.state = {
      editorState
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.editorState !== this.state.editorState) {
      const currentContent = this.state.editorState.getCurrentContent();
      this.props.dataCallback(
        convertToHTML(currentContent)
          .replace(/<figure>/g, "<p>")
          .replace(/<\/figure>/g, "</p>")
      );
      this.props.rawDataCallback(currentContent.getPlainText(""));
      this.props.charLengthCallback(
        currentContent.getPlainText("").replace(/ /g, "").length
      );
    }

    if (prevProps.reset !== this.props.reset && this.props.reset === true) {
      if (this.props.htmlData) {
        const html = this.props.htmlData;
        if (html && html.length > 0) {
          const contentBlock = convertFromHTML(html);
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          const editorState = EditorState.createWithContent(contentState);
          this.setState({ editorState });
        } else {
          this.setState({ editorState: EditorState.createEmpty() });
        }
      } else {
        this.setState({ editorState: EditorState.createEmpty() });
      }
    }
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  handlePastedText = (text, html) => {
    return false;
  };

  render() {
    const { editorState } = this.state;
    return (
      <>
        <Editor
          editorStyle={{
            border: this.props.display ? "0" : "1px solid #DEDEDF",
            paddingLeft: this.props.display ? "0" : "14px",
            borderRadius: this.props.display ? "0" : "0 0 5px 5px",
            paddingRight: this.props.display ? "0" : "14px",
            minHeight: this.props.display ? "1rem" : "20rem"
          }}
          toolbarStyle={{
            borderRadius: "5px 5px 0 0",
            marginBottom: "0",
            border: "solid #DEDEDF",
            borderWidth: "1px 1px 0 1px"
          }}
          toolbar={{
            options: ["inline", "blockType", "list", "history"],
            blockType: {
              options: ["Normal", "H3", "Blockquote"]
            }
          }}
          editorState={editorState}
          placeholder="Write your story... (at least 50 characters)"
          readOnly={this.props.readOnly ? true : false}
          toolbarHidden={this.props.toolbarHidden ? true : false}
          onEditorStateChange={this.onEditorStateChange}
          handlePastedText={this.handlePastedText}
        />
      </>
    );
  }
}

export default PostEditor;
