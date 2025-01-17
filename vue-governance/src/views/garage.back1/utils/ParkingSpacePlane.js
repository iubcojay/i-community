
import * as THREE from 'three';

export default class ParkingSpacePlane{
    constructor({text,fontSize,backgroundColor,width,height,position,rotation,textPosition}){
        text?this.text = text: this.text = 'A001'
        fontSize?this.fontSize = fontSize: this.fontSize = '50px'
        backgroundColor?this.backgroundColor = backgroundColor: this.backgroundColor = 'rgb(255,255,0)'
        width?this.width = width: this.width = 2.3
        height?this.height = height: this.height = 5.1
        this.canvasWidth = 100*this.width
        this.canvasHeight = 100*this.height
        position? this.position = position: this.position = [0,0.1,0]
        rotation? this.rotation = rotation: this.rotation = [-0.5*Math.PI,0,0]
        textPosition? this.textPosition = textPosition: this.textPosition = [0.5,0.25]

        this.panel = null
        this.canvas = null
        this.ctx = null
        this.createParkingSpacePlane()
    }

    createParkingSpacePlane(){
        this.createCanvas()
        this.createPanel()
    }

    createCanvas(){
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width',this.canvasWidth)
        this.canvas.setAttribute('height',this.canvasHeight)
        this.ctx =this.canvas.getContext('2d')

        this.ctx.beginPath()
        this.ctx.save()

        // 绘制背景色
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

        this.ctx.strokeStyle = 'white'
        this.ctx.fillStyle = 'white'
       
        this.ctx.textAlign = 'center'
        this.ctx.font = `bold ${this.fontSize} Arial`
        this.ctx.fillText(this.text,this.canvasWidth * this.textPosition[0],this.canvasHeight * this.textPosition[1])
       
        this.ctx.restore()
        this.ctx.closePath()
     
    }

    createPanel(){
        const planeGeometry = new THREE.PlaneGeometry(this.width, this.height);
        const planeMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMaterial.map =  new THREE.CanvasTexture( this.canvas);
        this.plane.position.set(...this.position)
        this.plane.rotation.set(...this.rotation)
    }
}