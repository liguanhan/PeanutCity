/**
 * Sample
 * React
 * Native
 * App
 * https://github.com/facebook/react-native
 * @flow
 * Created
 *     by
 *     Administrator
 *     on
 *     2018/3/19.
 */

import React, { Component,PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  TouchableOpacity,
  Image,
  Clipboard,
  Animated,
  Easing,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';
import { Container, Content,Form,Label, Item, Input, Icon } from 'native-base';
import {observable,action} from 'mobx';
import {observer} from 'mobx-react';
import NewNavTabPickerStore from '../../../Store/NavTabPickerStore'

import PublicGoBack from '../../PublicComponent/PublicGoBack'
import Checkbox from 'teaset/components/Checkbox/Checkbox';
import fetchJosn from '../../Fetch/FetchJson'
import Toast from 'teaset/components/Toast/Toast';


const Api='http://111.230.254.117:8000/getCode?'
const ApiPost='http://111.230.254.117:8000/registered'


@observer
export default class RegisteredPage extends PureComponent{
    state={
        secureTextEntry:false,
        textFromClipboard:'',
        checked:false,
        ImageHidden:false,
        PhoneText:'',
        PassWordText:'',
        registereduser:'',
        registeredInviteCode:'',
        Registered:[],
    }
    @observable VerificationStates='';
    @observable VerificationMessage='';
    @observable VerificationCode='';

    ChangeSecureTextEntry=()=>{
        this.setState({
            secureTextEntry:!this.state.secureTextEntry,
        })
    }

    pasteFromClipboard() {
      Clipboard.getString().then(
        (textFromClipboard) => {
          this.setState({
            textFromClipboard:textFromClipboard
          })
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }

    fetchData=async(Api)=>{
        const json =await fetchJosn(Api)
        this.VerificationStates=json.status;
        this.VerificationMessage=json.message;
        this.VerificationCode=json.code;
        if(this.VerificationStates==='sucess'){
            Toast.success('获取验证码成功');
        }else{
            Toast.success(this.VerificationStates+this.VerificationMessage);
        }
    }
    fetchPost=async(ApiPost)=>{
       const json=fetch(ApiPost, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body:`phone=${this.state.PhoneText}&code_check=${this.VerificationCode}&code_invite=${this.state.textFromClipboard}&password=${this.state.PassWordText}`,
        })
        .then((response) => response.text())
        .then((responseText) => {
            const json = JSON.parse(responseText);
            return json;
        })
        .then((json)=>{
            if(json.status==='success'){
                action
                NewNavTabPickerStore.Landing=true;
                action
                NewNavTabPickerStore.PassWord=this.state.PassWordText;
                action
                NewNavTabPickerStore.Phone=this.state.PhoneText;
                action
                NewNavTabPickerStore.Code=json.my_code_invite;
                AsyncStorage.setItem('Landing', JSON.stringify(NewNavTabPickerStore.Landing), (error, result) => {
                        if (!error) {
                            console.log('保存成功1')
                        }
                });
                AsyncStorage.setItem('PassWord', JSON.stringify(NewNavTabPickerStore.PassWord), (error, result) => {
                        if (!error) {
                            console.log('保存成功2')
                        }
                });
                AsyncStorage.setItem('Phone', JSON.stringify(NewNavTabPickerStore.Phone), (error, result) => {
                        if (!error) {
                            console.log('保存成功3')
                        }
                });
                AsyncStorage.setItem('Code', JSON.stringify(NewNavTabPickerStore.Code), (error, result) => {
                        if (!error) {
                            console.log('保存成功4')
                        }
                });
                Toast.message('注册成功,欢迎使用爆了么')
            }else{
                console.log(json)
            }
        })
        .then(
            this.props.navigation.navigate('MyTab')
        )
        .catch((error) => {
            console.error(error);
        })
    }

  render() {
    const {state,goBack,navigate}=this.props.navigation;
    const {
        ImageHidden,
        PhoneText,
        textFromClipboard,
        PassWordText,
    }=this.state;
    return (
      <Container
          style={styles.View}
      >
        <PublicGoBack
            goBack={()=>goBack()}
            title={state.params.title}
        />
        <Content
            style={styles.SmallView}
            showsVerticalScrollIndicator={false}
        >
            <Form>
                <Item floatingLabel>
                    <Label><Text style={styles.LabelText}>请输入手机号</Text> </Label>
                    <Icon active name='ios-phone-portrait' />
                    <Input
                        keyboardType='numeric'
                        maxLength={11}
                        onChangeText={(text) => {
                            this.setState({PhoneText:text})
                        }}
                        value={this.state.PhoneText}
                    />
                </Item>
                <Item floatingLabel>
                    <Label><Text style={styles.LabelText}>请输入邀请码</Text> </Label>
                    <Icon active name='md-person-add' style={styles.Icon2}/>
                    <Input
                        autoCapitalize='none'
                        value={this.state.textFromClipboard}
                        onChangeText={(text) => {
                            this.setState({textFromClipboard:text})
                        }}
                        maxLength={6}
                    />
                </Item>
                    <TouchableOpacity style={styles.redView1}
                          onPress={this.pasteFromClipboard.bind(this)}
                    >
                        <Text style={styles.redText}>粘贴邀请码</Text>
                    </TouchableOpacity>
                <Item floatingLabel>
                    <Label><Text style={styles.LabelText}>请输入验证码</Text> </Label>
                    <Icon active name='ios-unlock' />
                    <Input
                        keyboardType='numeric'
                        autoCapitalize='none'
                        onChangeText={(text) => {
                            this.VerificationCode=text
                        }}
                        value={this.VerificationCode}
                        maxLength={6}
                    />
                </Item>
                <TouchableOpacity
                    style={styles.redView2}
                    onPress={()=>{
                        this.fetchData(`${Api}phone=${PhoneText}&code_invite=111111`)
                    }}
                >
                    <Text style={styles.redText}>获取验证码</Text>
                </TouchableOpacity>
                <Item floatingLabel>
                    <Icon active name='key'/>
                    <Label><Text style={styles.LabelText}>请输入6~32位密码</Text> </Label>
                    <Input
                        maxLength={32}
                        secureTextEntry={this.state.secureTextEntry}
                        autoCapitalize='none'
                        onChangeText={(text) => {
                            this.setState({PassWordText:text})
                        }}
                        value={this.state.PassWordText}
                    />
                </Item>
            </Form>
            <TouchableOpacity onPress={this.ChangeSecureTextEntry}
                              style={styles.Image6View}
            >
                {
                  this.state.secureTextEntry
                  ?
                      <Image
                          source={require('../../../Icons/Down.png')}
                          style={styles.Image6}
                      />
                  :
                      <Image
                          source={require('../../../Icons/See.png')}
                          style={styles.Image6}
                      />
                }
            </TouchableOpacity>
            <View style={styles.CheckBoxView}>
                <TouchableOpacity
                    style={styles.ImageView}
                    onPress={()=>{
                        this.setState({
                            ImageHidden:!this.state.ImageHidden
                        })
                    }}
                >
                    {
                        this.state.ImageHidden
                        ?
                            <Image
                                source={require('../../../Icons/BlackYes.png')}
                                style={styles.YesImage}
                            />
                        :
                            <View></View>
                    }
                </TouchableOpacity>
                <Text style={styles.Text1}>*同意
                    <Text style={styles.Text2}> &lt;&lt;爆了么App用户协议&gt;&gt; </Text>
                </Text>
            </View>

            {
                ImageHidden&&PhoneText.length===11&&textFromClipboard.length===6&&this.VerificationCode.length===6&&PassWordText.length>=6&&PassWordText.length<=32
                ?
                <View style={styles.TextView3}>
                    <TouchableOpacity
                        style={styles.TextView5}
                        onPress={()=>{
                            this.fetchPost(ApiPost)
                            }
                        }
                    >
                        <Text style={styles.Text3}>立即注册</Text>
                    </TouchableOpacity>
                </View>
                :
                <View style={styles.TextView3}>
                    <View style={styles.TextView4}>
                        <Text style={styles.Text3}>立即注册</Text>
                    </View>
                </View>
            }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    View:{
        flex:1,
        backgroundColor:'#FFF'
    },
    SmallView:{
        marginLeft:40,
        marginRight:40,
        marginTop:30,
        height:350,
    },
    Icon2:{
        marginLeft:-5,
    },
    LabelText:{
        fontSize:14,
        color:'gray',
    },
    Image6View:{
        position:'absolute',
        top:235,
        right:10,
    },
    Image6:{
        width:25,
        height:25,
    },
    redView1:{
        width:100,
        height:25,
        borderWidth:1,
        borderColor:'red',
        borderRadius:13,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        right:10,
        top:100,
    },
    redView2:{
        width:100,
        height:25,
        borderWidth:1,
        borderColor:'red',
        borderRadius:13,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        right:10,
        top:165,
    },
    redText:{
        color:'red'
    },
    TextView:{
        height:30,
        width:200,
        backgroundColor:'#000'
    },
    Text1:{
        color:'#000'
    },
    Text2:{
        color:'red',
        marginLeft:20,
    },
    CheckBoxView:{
        flexDirection:'row',
        justifyContent:'center',
        marginTop:30,
        marginLeft:10,
    },
    ImageView:{
        width:15,
        height:15,
        borderRadius:2,
        borderWidth:1,
        borderColor:'#000',
        alignItems:'center',
        justifyContent:'center',
        marginTop:3,
        marginRight:5,
    },
    YesImage:{
        width:15,
        height:15
    },
    TextView3:{
        alignItems:'center',
        marginLeft:15,
    },
    TextView4:{
        alignItems:'center',
        width:'100%',
        height:35,
        borderRadius:20,
        backgroundColor:'lightgrey',
        marginTop:15,
        justifyContent:'center'
    },
    Text3:{
        color:'#FFF'
    },
    TextView5:{
        alignItems:'center',
        width:'100%',
        height:35,
        borderRadius:20,
        backgroundColor:'red',
        marginTop:15,
        justifyContent:'center'
    }
});
