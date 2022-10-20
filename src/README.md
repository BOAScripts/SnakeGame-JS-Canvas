# SNAKE GAME js

## Context
It's a project I put in place to practice JavaScript, HTML, CSS.  
I first tried it using div's, than I stumbled accross the HTML canvas element, and a good explanation from 'CodeExplainedRepo' (in references)


> ## Issues
>> ### **Unwanted behaviour when keys are pressed too quickly**:  
>>> #### *example*:  
>>> direction=LEFT  
>>> if 'UP(or DOWN) & RIGHT' pressed too quickly  
>>> - trigger `gameover()` (when snake.length > 2)
>>> - reverse snake direction.  (when snake.length <= 2)
>>
>> ***Reason*** : It has to come from the fact that the eventListener of the keypress is not subject of the timing event of the displayFrame.  
>>
>> ***Possible mitigation*** : synchronize the timing event between keypress & displayFrame.   
>>
>> ***Solution*** : Define a boolean (canPress) if key can be pressed or not.  
>> Set to true once per frame.  
>> Set to false once a key is pressed.  
>>> ***Result*** : it feels like some directional inputs are not registered.  

> ### References
> 'github.com/CodeExplainedRepo/Snake-JavaScript'  
> ⤷ which looks like a simpler version of 'googlesnake.com'