import React from "react"

import { Form, Input, Button, message } from "antd"
import { createRoom } from "services/room"
// const { Option } = Select
class CreateRoomForm extends React.Component {
  state = {
    submitting: false
  }
  room = this.props.room
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        window.spDebug("Received values of form: " + values)

        if (!(values.name && values.about)) {
          message.error("必须填写房间名与介绍")
          return
        }
        this.setState({ submitting: true })
        if (this.room) {
          values["roomId"] = this.room.id
        }
        createRoom(values)
          .then(resp => {
            message.success("成功！")
            this.props.back()
            this.props.afterUpdateCb(resp.data)
            // reload all rooms
          })
          .catch(err => {})
          .then(() => {
            this.setState({ submitting: false })
          })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    }
    return (
      <Form
        style={{ width: "95%", margin: "auto" }}
        {...formItemLayout}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label={<span>房间名 (必填)</span>}>
          {getFieldDecorator("name", {
            rules: [
              {
                message: "房间名不能为空",
                whitespace: true
              },
              {
                max: 12,
                message: "房间名最多12个字符"
              },
              {
                min: 1,
                message: "房间名最少1个字符"
              }
            ],
            initialValue: this.room && this.room.name
          })(<Input />)}
        </Form.Item>

        <Form.Item label={<span>房间介绍 (必填)</span>}>
          {getFieldDecorator("about", {
            initialValue: this.room && this.room.about
          })(<Input.TextArea placeholder="房间话题与聊天规则" />)}
        </Form.Item>
        <Form.Item label={<span>背景图片地址</span>}>
          {getFieldDecorator("background", {
            initialValue: this.room && this.room.background
          })(<Input />)}
        </Form.Item>
        <Form.Item label={<span>封面图片地址</span>}>
          {getFieldDecorator("cover", {
            initialValue: this.room && this.room.cover
          })(<Input />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              资源列表 (一行一条)
              <div style={{ color: "gray", lineHeight: "20px" }}>
                <div style={{ marginBottom: 10 }}>
                  请使用markdown格式, 如下:
                </div>
                <div> [双节棍](http://12.com/34.mp3)</div>
                <div> [菊花台](http://56.com/78.mp3)</div>
                <br />
              </div>
            </span>
          }
        >
          {getFieldDecorator("media", {
            initialValue: this.room && this.room.mediaRaw
          })(<Input.TextArea />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button
            // size="large"
            style={{ marginRight: 10 }}
            onClick={this.props.back}
          >
            取消
          </Button>
          <Button
            loading={this.state.submitting}
            type="primary"
            // size="large"
            htmlType="submit"
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedCreateRoomForm = Form.create({ name: "create-room" })(
  CreateRoomForm
)

export default WrappedCreateRoomForm
