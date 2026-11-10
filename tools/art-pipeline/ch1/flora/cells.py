XB=[0,180,357,534,710,886,1066,1244,1379]
R=[(8,192),(196,378),(379,578),(580,752)]
def cell(r,c):return (XB[c],R[r][0],XB[c+1],R[r][1])
cells={'idle':[cell(0,i) for i in range(6)],'bloom':[cell(1,i) for i in range(8)],'attack':[cell(2,i) for i in range(7)],'shot':[cell(2,7)],'hurt':[cell(3,i) for i in range(4)]}
