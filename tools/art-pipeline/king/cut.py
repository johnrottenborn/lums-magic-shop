import numpy as np,json
from PIL import Image
src=np.array(Image.open('sheet.jpg').convert('RGB'))
rows={'idle':(25,150,[(3,166),(175,338),(345,509),(517,681),(690,852),(860,1023),(1033,1193),(1203,1364)]),
 'move':(180,305,[(9,175),(179,344),(348,518),(516,685),(688,858),(856,1028),(1025,1197),(1196,1371)]),
 'spell':(332,455,[(6,176),(175,345),(343,516),(515,689),(687,863),(860,1040),(1030,1210),(1214,1352)]),
 'hurt':(486,608,[(8,175),(180,340),(352,512),(519,687),(689,859),(862,1033)]),
 'die':(642,762,[(5,173),(175,343),(357,517),(535,679),(701,854),(874,1025),(1037,1197),(1208,1365)])}
meta=[]
for r,(y0,y1,cols) in rows.items():
  for i,(a,b) in enumerate(cols):
    a=max(0,a-6);b=min(src.shape[1],b+6);c=src[y0:y1,a:b];n=f'{r}{i}';Image.fromarray(c).save(f'c_{n}.png');meta.append(n)
json.dump(meta,open('meta.json','w'));print(len(meta))
